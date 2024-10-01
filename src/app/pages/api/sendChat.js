export default async function handler(req, res) {
  const { userMessage } = req.body;

  try {
    const apiRes = await fetch("https://keploy-api.abhishekkushwaha.me/chat", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: userMessage }),
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json();
      return res
        .status(apiRes.status)
        .json({ error: "Error from Keploy API", details: errorData });
    }

    const data = await apiRes.json();
    res.status(200).json({ response: data });
  } catch (error) {
    res.status(500).json({ error: "Error fetching response from Keploy API" });
  }
}
