import uuid
from datetime import datetime
from Database import DataBaseManager

db = DataBaseManager()


class messageManager:
    def _build_receiver_entry(self, msg_Id, receiver_Gmail, project_Id, *, is_sender=False):
        """Build a single receiver_storage document.
        Sender's own copy is pre-marked as read with no notification."""
        return {
            "msg_Id": msg_Id,
            "receiver_Gmail": receiver_Gmail,
            "is_Read": is_sender,
            "notification": not is_sender,
            "is_Deleted": False,
            "project_Id": project_Id,
        }

    def _build_reply_entry(self, parent_Msg_Id, reply_Msg_Id, receiver_Gmail, project_Id, *, is_sender=False):
        """Build a single reply_storage document.
        Sender's own copy is pre-marked as read with no notification."""
        return {
            "parent_Msg_Id": parent_Msg_Id,
            "reply_Msg_Id": reply_Msg_Id,
            "receiver_Gmail": receiver_Gmail,
            "is_Read": is_sender,
            "notification": not is_sender,
            "is_Deleted": False,
            "project_Id": project_Id,
        }

    def _decrement_usage(self, project_Id, amount):
        """Deduct usage credits for a project."""
        db.update_db(
            "api_keys_storage",
            {"project_Id": project_Id},
            {"$inc": {"usage_Left": -amount}},
        )

    def _get_thread_participants(self, parent_Msg_Id, project_Id):
        """Return all unique gmail addresses that are part of a thread,
        sourced from receiver_storage (original recipients + sender copy)."""
        entries = db.fetch_all(
            "receiver_storage",
            {"msg_Id": parent_Msg_Id, "project_Id": project_Id},
        )
        return list({entry["receiver_Gmail"] for entry in entries})

    def _matched(self, result):
        """Safely read matched_count — guards against DataBaseManager returning an
        Exception object instead of raising it (it currently swallows exceptions).
        Raises the original exception so the caller sees the real error."""
        if isinstance(result, Exception):
            raise result
        return result.matched_count > 0

    def send_msg(self, username, sender_Gmail, receiver_Gmail: list, subject, message, can_Reply, project_Id):
        msg_Id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()

        # Build per-user receiver entries.
        # Sender's own copy is marked as already read (no notification).
        receiver_data = []
        for gmail in receiver_Gmail:
            receiver_data.append(
                self._build_receiver_entry(msg_Id, gmail, project_Id, is_sender=False)
            )
        receiver_data.append(
            self._build_receiver_entry(msg_Id, sender_Gmail, project_Id, is_sender=True)
        )

        message_data = {
            "msg_Id": msg_Id,
            "sender_Gmail": sender_Gmail,
            "username": username,
            "subject": subject,
            "message": message,
            "created_At": timestamp,
            "is_Deleted": False,
            "can_Reply": can_Reply,
            "project_Id": project_Id,
        }

        db.store_data("message_storage", message_data)
        db.store_data("receiver_storage", receiver_data)

        # Charge usage for every participant (receivers + sender copy)
        usage = len(receiver_Gmail) + 1
        self._decrement_usage(project_Id, usage)

    def get_msg(self, receiver_Gmail, project_Id):
        query = {"receiver_Gmail": receiver_Gmail, "is_Deleted": False, "project_Id": project_Id}

        # Fetch all inbox entries from both storages
        inbox_entries = db.fetch_all("receiver_storage", query)
        inbox_replies  = db.fetch_all("reply_storage", query)

        # Collect unread ids for is_Read enrichment later
        unread_ids = set()
        for entry in inbox_entries:
            if not entry["is_Read"]:
                unread_ids.add(entry["msg_Id"])
        for entry in inbox_replies:
            if not entry["is_Read"]:
                unread_ids.add(entry["reply_Msg_Id"])
                unread_ids.add(entry["parent_Msg_Id"])

        # Gather all relevant message ids across both storages
        msg_ids    = [entry["msg_Id"]        for entry in inbox_entries]
        reply_ids  = [entry["reply_Msg_Id"]  for entry in inbox_replies]
        parent_ids = [entry["parent_Msg_Id"] for entry in inbox_replies]
        all_ids = list(set(msg_ids + reply_ids + parent_ids))

        # Fetch and enrich each active message
        messages = []
        for msg_Id in all_ids:
            msg = db.fetch("message_storage", {"msg_Id": msg_Id, "is_Deleted": False})
            if msg:
                msg["is_Read"] = msg_Id not in unread_ids
                messages.append(msg)

        messages.sort(key=lambda x: x["created_At"])

        # Group into threads keyed by parent_Msg_Id when present, else msg_Id.
        # Note: only reply documents in message_storage carry parent_Msg_Id;
        # original messages will fall through to their own msg_Id, which is correct.
        inbox = {}
        for msg in messages:
            thread_key = msg.get("parent_Msg_Id") or msg["msg_Id"]
            inbox.setdefault(thread_key, []).append(msg)

        return inbox

    def reply_msg(self, parent_Msg_Id, username, sender_Gmail, message, project_Id):
        # Enforce can_Reply on the parent — the parent message governs the whole thread
        parent = db.fetch("message_storage", {"msg_Id": parent_Msg_Id, "project_Id": project_Id})
        if not parent:
            return {"error": "Parent message not found"}
        if not parent.get("can_Reply", True):
            return {"error": "Replies are disabled for this message"}

        reply_Msg_Id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()

        message_data = {
            "msg_Id": reply_Msg_Id,
            "parent_Msg_Id": parent_Msg_Id,
            "sender_Gmail": sender_Gmail,
            "username": username,
            "message": message,
            "created_At": timestamp,
            "is_Deleted": False,
            "project_Id": project_Id,
        }
        db.store_data("message_storage", message_data)

        # Fan out reply to ALL thread participants, not just the original receiver.
        # Participants are derived from receiver_storage entries for the parent message.
        participants = self._get_thread_participants(parent_Msg_Id, project_Id)

        reply_entries = []
        for gmail in participants:
            is_sender = (gmail == sender_Gmail)
            reply_entries.append(
                self._build_reply_entry(
                    parent_Msg_Id, reply_Msg_Id, gmail, project_Id, is_sender=is_sender
                )
            )

        db.store_data("reply_storage", reply_entries)
        self._decrement_usage(project_Id, len(participants))

    def read_msg(self, receiver_Gmail, msg_Id, project_Id):
        update = {"$set": {"is_Read": True, "notification": False}}

        db.update_db(
            "receiver_storage",
            {"msg_Id": msg_Id, "receiver_Gmail": receiver_Gmail, "project_Id": project_Id},
            update,
        )
        db.update_db(
            "reply_storage",
            {"reply_Msg_Id": msg_Id, "receiver_Gmail": receiver_Gmail, "project_Id": project_Id},
            update,
        )
        return {"message": "Read Successfully"}

    def soft_delete_msg(self, gmail, msg_Id, project_Id):
        # Case 1: sender deleting their own message — deletes for everyone (except admin)
        result = db.update_field(
            "message_storage",
            {"msg_Id": msg_Id, "sender_Gmail": gmail, "project_Id": project_Id},
            {"is_Deleted": True},
        )
        if self._matched(result):
            self._decrement_usage(project_Id, 1)
            return {"message": "Deleted message successfully"}

        # Case 2: receiver deleting a received message from their inbox
        result = db.update_field(
            "receiver_storage",
            {"msg_Id": msg_Id, "receiver_Gmail": gmail, "project_Id": project_Id},
            {"is_Deleted": True},
        )
        if self._matched(result):
            self._decrement_usage(project_Id, 1)
            return {"message": "Deleted successfully"}

        # Case 3: user deleting a reply from their inbox
        result = db.update_field(
            "reply_storage",
            {"reply_Msg_Id": msg_Id, "receiver_Gmail": gmail, "project_Id": project_Id},
            {"is_Deleted": True},
        )
        if self._matched(result):
            self._decrement_usage(project_Id, 1)
            return {"message": "Deleted reply successfully"}

        return {"error": "Message not found or already deleted"}

    def delete_msg(self, msg_Id, project_Id):
        """Permanent delete — ADMIN ONLY.
        Cleans up message_storage, receiver_storage, and reply_storage."""
        db.delete("message_storage", {"msg_Id": msg_Id, "project_Id": project_Id})
        db.delete_many("receiver_storage", {"msg_Id": msg_Id, "project_Id": project_Id})
        db.delete_many("reply_storage", {"reply_Msg_Id": msg_Id, "project_Id": project_Id})
        db.delete_many("reply_storage", {"parent_Msg_Id": msg_Id, "project_Id": project_Id})
        self._decrement_usage(project_Id, 1)
        return {"message": "Deleted successfully"}