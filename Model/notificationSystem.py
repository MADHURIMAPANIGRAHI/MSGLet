from Database import DataBaseManager

db=DataBaseManager()

class notifcationManager:
    def get_notification(self, receiver_Gmail, project_Id):
        query = {"receiver_Gmail": receiver_Gmail, "is_Deleted": False, "project_Id": project_Id}
        inbox_Entries = db.fetch_all("receiver_storage", query)
        inbox_Replies = db.fetch_all("reply_storage", query)
        notification = set()
        for entry in inbox_Entries:
            if entry["notification"]:
                notification.add(entry["msg_Id"])
        for entry in inbox_Replies:
            if entry["notification"]:
                notification.add(entry["reply_Msg_Id"])
                notification.add(entry["parent_Msg_Id"])
        messages = []
        for msg_Id in notification:
            msg = db.fetch("message_storage", {"msg_Id": msg_Id, "is_Deleted": False})
            if msg:
                messages.append(msg)
        messages.sort(key=lambda x: x["created_At"])
        inbox = {}
        for msg in messages:
            thread_key = msg.get("parent_Msg_Id") or msg["msg_Id"]
            inbox.setdefault(thread_key, []).append(msg)
        return inbox