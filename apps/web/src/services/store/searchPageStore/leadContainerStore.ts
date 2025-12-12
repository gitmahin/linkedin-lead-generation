import { action, makeObservable, observable } from "mobx";

export type LinkedinLeadsType = {
    name: string,
    image: string,
    profile_url: string,
    contact: {
        href: string,
        text: string,
        link_type: string
    }[]
    description: string
    location: string
}

 class LeadContainerStore {
    public leads: LinkedinLeadsType[] = []
    public loading: boolean = false
    constructor() {
        makeObservable(this, {
            leads: observable,
            loading: observable,
            setLoading: action,
            setLeads: action
        })
    }


    setLeads(lead: LinkedinLeadsType) {
        if(lead){
            this.leads.unshift(lead);
        }
    }

    setLoading(value: boolean) {
        this.loading = value
    }
}

export const leadContainerStore = new LeadContainerStore()

