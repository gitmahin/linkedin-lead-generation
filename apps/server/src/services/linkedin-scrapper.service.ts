import { ScrapperTypes, WebScrapper } from "./web-scrapper.service";

export class LinkedinScrapper extends WebScrapper {
    constructor(scrapper_type: ScrapperTypes, identifier: string, password: string) {
        super(scrapper_type, identifier, password)
        this.scrapper_type = "linkedin"
    }

    async useGUIScrapper() {

    }

    async useHeadlessScrapper() {

    }

    
}