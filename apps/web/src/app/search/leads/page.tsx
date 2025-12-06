import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  Button,
} from "@repo/ui";
import React from "react";

// {
//     "lead": "software engineers",
//     "username": "janedoe",
//     "userLink": "https://www.linkedin.com/in/janedoe/",
//     "emails": [
//       "jane.doe@example.com"
//     ]
//   },

export default function LeadPage() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((item, i) => {
        return (
          <Card key={i}>
            <CardHeader>
              <CardTitle>jonedoe</CardTitle>
              <CardDescription>software Engineer</CardDescription>
            </CardHeader>
            <CardContent>Email: jone.doe@example.com</CardContent>
          </Card>
        );
      })}
    </div>
  );
}
