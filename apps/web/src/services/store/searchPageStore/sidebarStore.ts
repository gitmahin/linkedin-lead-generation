import { action, makeObservable, observable } from "mobx"

class SidebarStore {
    location: string = ""

    constructor() {
        makeObservable(this, {
            location: observable,
            setLocation: action
        })
    }

    setLocation(location: string) {
        this.location = location
    }
}

export const sidebarStore = new SidebarStore()
