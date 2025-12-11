
interface WebScrapperDataTypes {

}

export type ScrapperTypes = "linkedin" | "facebook" | "twitter" | null

export class WebScrapper implements WebScrapperDataTypes {
    public scrapper_type: ScrapperTypes = null
    private identifier: string = ""
    private password: string = ""


    constructor(scrapper_type: ScrapperTypes, identifier: string, pass: string) {
        this.scrapper_type = scrapper_type
        this.identifier = identifier
        this.password = pass
    }

    get ScrapperType() {
        return this.scrapper_type
    }

}