const IP_INFO_URL = 'https://ipinfo.io';

export async function GET(req: Request) {
  try {
    let ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    ip = cleanIp(ip);
    const res = await fetch(`${IP_INFO_URL}/${ip}/json/`);
    console.log(req.headers)
    console.log(ip)

    if (!res.ok) {
      throw new Error(`IP info service responded with status: ${res.status}`);
    }
  
    const data = await res.json();
    return Response.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=600'
      }
    })
  } catch (error) {
    console.error('Location API error:', error)
    return Response.json(
      { error: 'Failed to fetch location data' },
      { status: 500 }
    )
  }
}

function cleanIp(ip: string | null): string {
  if (ip == null || ip.trim() === "" || ip === "unknown") {
    return "";
  }

  if (ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  if (ip === "::1") {
    ip = "127.0.0.1";
  }

  return ip;
}