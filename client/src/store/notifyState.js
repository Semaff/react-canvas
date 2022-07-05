import { makeAutoObservable } from "mobx";

class NotifyState {
    constructor() {
        this.notifications = [];
        makeAutoObservable(this);
    }

    addNotification(notification) {
        this.notifications.push(notification);
        setTimeout(() => {
            this.removeNotification(notification.id);
        }, 2000);
    }

    removeNotification(id) {
        this.notifications = [...this.notifications.filter(notif => notif.id !== id)];
    }
}

export default new NotifyState();