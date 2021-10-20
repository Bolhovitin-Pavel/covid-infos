import axios from "axios";
import covidInfoData from "./localCovidInfos.json";


const PROXY_SERVER = "http://localhost:3001";
const API_SERVER = "https://opendata.ecdc.europa.eu/covid19/casedistribution/json/";


export default class CovidInfoService {

    static async GetData() {
        try {
            const data = await this.GetDataFromServer(API_SERVER);
            console.warn("Covid data from API server was loaded successfully.");
            return data;
        }
        catch (e) {
            console.error(e);

            try {
                const data = await this.GetDataFromServer(PROXY_SERVER);
                console.warn("Covid data from proxy server was loaded successfully.");
                return data;
            }
            catch (e) {
                console.error(e);

                try {
                    const data = await this.GetDataFromLocal();
                    console.warn("Local Covid data is used.");
                    return data;
                }
                catch (e) {
                    throw "Error, trying to fetch data.";
                }
            }
        }
    }


    static async GetDataFromLocal() {
        return await covidInfoData.records;
    }


    static async GetDataFromServer(server) {
        try {
            const response = await axios.get(server);
            return response.data.records;
        }
        catch (e) {
            throw `Cannot access to server (${server}).`;
        }
    }
}


  // const reversedProxyServer = "http://localhost:3000";

  // //#region Fetch Covid Infos
  // useEffect(() => SetupCovidInfos(), []);

  // async function SetupCovidInfos() {
  //   console.log("Fetch Covid Infos");
  //   const data = await GetCovidInfos();
  //   const uniqueInfos = data.records.map((info, index) => ({ id: index, ...info}));
  //   SetCovidInfos(uniqueInfos);
  // }

  // async function GetCovidInfos() {
  //   const response = await axios.get(reversedProxyServer);
  //   return response.data;
  // }
  // //#endregion


