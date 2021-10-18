import axios from "axios";
import covidInfoData from "./localCovidInfos.json";



const PROXY_SERVER = "http://localhost:3000";
const API_SERVER = "https://opendata.ecdc.europa.eu/covid19/casedistribution/json/";



export default class CovidInfoService {

    static GetDataFromLocal() {
        return covidInfoData.records;
    }


    static async GetDataFromProxyServer() {
        const response = await axios.get(PROXY_SERVER);
        return response.data.records;


        // await axios.get(server)
        // .then(function (response) {
        //     return response.data;
        // })
        // .catch(function (error) {
        //     console.error(error);
        // })
        // .then(function () {
        //     // always executed
        // });
    }



    static async GetDataFromAPIServer() {
        const response = await axios.get(API_SERVER);
        return response.data.records;
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


