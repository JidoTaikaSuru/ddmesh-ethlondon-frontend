import axios, {AxiosInstance} from "axios";

export class NeonClient {
    baseUrl = "https://console.neon.tech/api/v2"
    apiKey: string;
    headers: { [key: string]: string };
    private neonAxios: AxiosInstance;

    constructor(apiKey: string) {
        this.neonAxios = axios.create({
            baseURL: '/neon',
        });
        this.apiKey = apiKey
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Headers": "*",

        }
    }

    setApiKey(apiKey: string) {
        this.apiKey = apiKey
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        }
    }

    async getFirstProjectId() {
        console.log(`${this.baseUrl}/projects`)
        console.log("headers", this.headers)
        const res =  await this.neonAxios.get(`/projects`, {
            headers: this.headers,
        })
        console.log("sanity")
        return res.data.projects?.[0]?.id
    }

    async getFirstBranchId(projectId: string) {
        console.log(`${this.baseUrl}/projects/${projectId}/branches`)
        const res =  await this.neonAxios.get(`/projects/${projectId}/branches`, {
            headers: this.headers,
        })
        return res.data.branches?.[0]?.id
    }
    async getCurrentNumberOfDeployedDBs(projectId: string, branchId: string) {
        console.log(`${this.baseUrl}/projects/${projectId}/branches/${branchId}/databases`)
        const res =  await this.neonAxios.get(`/projects/${projectId}/branches/${branchId}/databases`, {
            headers: this.headers,
        })
        console.log(res.data)

        return res.data.databases ? res.data.databases.length : 0
    }
}
