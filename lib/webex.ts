import { SendWebexMessageParams, WebexEmployee, WebexMessageResponse } from "@/types/webex";


export async function getWebexPeople(
  displayName: string,
): Promise<WebexEmployee> {
  const url = new URL("https://webexapis.com/v1/people");

  url.searchParams.set("displayName", displayName);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_WEBEX_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Webex People API Error: ${response.status} ${error.message}`);
  }

  return await response.json();
}

export async function sendWebexMessage({
  personalId,
  text,
}: SendWebexMessageParams): Promise<WebexMessageResponse> {
  const body = {
    toPersonId : personalId,
    text : text
  }

  const response = await fetch("https://webexapis.com/v1/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_WEBEX_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Webex API Error: ${response.status} ${error.message}`);
  }

  return await response.json();
}

