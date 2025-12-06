import { apifyClient } from "@/lib";



export async function getLinkedinLead() {

    const input = {
    "keyword": "marketing",
    "max_leads": 10
};
    // Run the Actor and wait for it to finish
    const run = await apifyClient.actor("Oliuhvq8My0EiVIT0").call(input);

    // Fetch and print Actor results from the run's dataset (if any)
    console.log('Results from dataset');
    const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
    items.forEach((item: any) => {
        console.dir(item);
    });
    return 0;
}
