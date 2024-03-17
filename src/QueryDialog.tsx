import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FC, useEffect, useState } from "react";
import { Card } from "@/components/ui/card.tsx";
// @ts-ignore
// import {Client} from "pg-ens";
import {Client, ClientConfig} from "pg-node-ens";
import {Textarea} from "@/components/ui/textarea.tsx";

// import postgres from 'postgres'
import axios from "axios";
// import {parse as parseConnectionString} from "pg-connection-string";

export const QueryDialog: FC<{ connectionString: string }> = ({
  connectionString,
}) => {
  console.log("connectionString", connectionString);
  const connectionStringReplace = connectionString.replace(
    "neon.tech/",
    "neon.tech:5432/"
  );
  console.log("connectionStringReplace", connectionStringReplace);
  const [query, setQuery] = useState(
    "select table_name from information_schema.tables LIMIT 10;"
  );
  const [startExecuteQuery, setStartExecuteQuery] = useState(false);
  const [queryResult, setQueryResult] = useState([] as any[]);
  const [queryError, setQueryError] = useState("");
  const copy = async () => {
    await navigator.clipboard.writeText(connectionString);
    alert("Text copied");
  };
  const regex = /^postgresql:\/\/([^:]+):([^@]+)@([^:]+)\/([^?]+)\?(.+)/;
  const matches = connectionString.match(regex);
  if (!matches) {
    return <div>Invalid connection string</div>;
  }
  //   const sql = postgres("postgres://username:password@host:port/database", {
  //     host: matches[3], // Postgres ip address[s] or domain name[s]
  //     port: 5432, // Postgres server port[s]
  //     database: matches[4], // Name of database to connect to
  //     username: matches[1], // Username of database user
  //     password: matches[2], // Password of database user
  //   });
  const config: ClientConfig = {
    // user: matches[1],
    // password: matches[2],
    // host: matches[3],
    // port: 5432,
    // database: matches[4],
    // options: 'sslmode=require',
    // ssl: {}
    connectionString: connectionString,
  };
  // const config = parseConnectionString(connectionStringReplace);
  // const connectionStringUrl = new URL(connectionString);
  // const config = {
  //     user: connectionStringUrl.username,
  //     password: connectionStringUrl.password,
  //     host: connectionStringUrl.hostname,
  //     port: connectionStringUrl.port,
  //     database: connectionStringUrl.pathname.split('/')[1],
  //     ssl: connectionStringUrl.searchParams.get('sslmode') === 'require' ? {rejectUnauthorized: false} : false
  // };
  console.log("config", config);

  // const client = new Client();
  useEffect(() => {
    const executeQuery = async () => {
      try {
        const res = await axios.post("http://localhost:3002/proxy-postgres", {
          query,
          connectionString,
        });
        console.log("res", res.data.rows);
        setQueryResult(res.data.rows);
      } catch (e: any) {
        console.error(e);
        setQueryError(e.message);
      }
    };

    if (startExecuteQuery) {
      executeQuery();
    }
    const regex = /^postgresql:\/\/([^:]+):([^@]+)@([^:]+)\/([^?]+)\?(.+)/;
    const matches = connectionString.match(regex);
    if(!matches) {
        return <div>Invalid connection string</div>
    }
   
    // const config = parseConnectionString(connectionStringReplace);
    // const connectionStringUrl = new URL(connectionString);
    // const config = {
    //     user: connectionStringUrl.username,
    //     password: connectionStringUrl.password,
    //     host: connectionStringUrl.hostname,
    //     port: connectionStringUrl.port,
    //     database: connectionStringUrl.pathname.split('/')[1],
    //     ssl: connectionStringUrl.searchParams.get('sslmode') === 'require' ? {rejectUnauthorized: false} : false
    // };
    // console.log("config", config)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Conn. String</Button>
      </DialogTrigger>
      <DialogContent className="sm:max">
        <DialogHeader>
          <DialogTitle>API Key</DialogTitle>
          <DialogDescription>
            <Card className="w-96 overflow-scroll bg-secondary">
              {connectionString}
              <Button onClick={copy}>Copy</Button>
            </Card>
            <Textarea
              placeholder="Type your SQL query here"
              onChange={(e) => setQuery(e.target.value)}
            />
            {JSON.stringify(queryResult, null, 2)}
            <p className={"text-red-500"}>{queryError.toString()}</p>
            <Button onClick={() => setStartExecuteQuery(true)}>Execute</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
