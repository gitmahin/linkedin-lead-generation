import { Card, CardContent } from "@repo/ui";
import React from "react";

export default function LeadPage() {
  return <div>
    {
      Array.from({length: 10}).map((item, i) => {
        return <Card key={i}>
          <CardContent  >


          </CardContent>
        </Card>
      })
    }
  </div>;
}
