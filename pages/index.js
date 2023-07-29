import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";

export default function Home() {
  const [airport, setAirport] = useState("")
  const [weather, setWeather] = useState(null)

  async function weatherLookup() {
    if (!airport) {
      alert("No airport given :(")
      return
    }
    await fetch("/api/weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({airport})
    }).then((res) => res.json()).then((data) => {
      setWeather(data)
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Go/No-Go Decision</title>
      </Head>

      <main>
        <h1 className={styles.title}>Go/No-Go Decision Support Tool</h1>

        <input
          value={airport}
          onChange={(e) => {
            setAirport(e.target.value)
          }}
        />
        <button
          onClick={weatherLookup}
        >Search</button>

        <p>{JSON.stringify(weather)}</p>

        {/* <form action="/api/weather" method="post">
          <label for="airport">Airport Iata Code:</label>
          <input type="text" id="airport" name="airport" />
          <button type="submit">Submit</button>
        </form> */}
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
