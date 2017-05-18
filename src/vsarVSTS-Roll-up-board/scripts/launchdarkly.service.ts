import * as LDClient from "ldclient-js";
import Q = require("q");

export class LaunchDarklyService {

    public ldClient: any;
    public envId: string = "590348c958ed570a3af8a496";
    public enabletelemetry: boolean;
    public displayLogs: boolean;
    private static _instance: LaunchDarklyService;

    constructor() { }

    public static Init(user: any): LaunchDarklyService {
        if (!this._instance) {
            this._instance = new LaunchDarklyService();
            this._instance.ldClient = LDClient.initialize(this._instance.envId, user);
        }
        return this._instance;
    }

    /*public static InitService(user: any): Q.Promise<any> {
        var deferred = Q.defer<any>();
        var ldclient = LDClient.initialize(this._instance.envId, user);
        ldclient.on('ready', function () {
            deferred.resolve(ldclient)
        })
        return deferred.promise;
    }*/
    public GetAllFlags() {
        this.enabletelemetry = this.ldClient.variation("enable-telemetry", false);
        this.displayLogs = this.ldClient.variation("display-logs", false);
        console.log("this.displayLogs: " + this.displayLogs);
        console.log("this.enabletelemetry: " + this.enabletelemetry);

        // for view all user flags
        // let flags = ldclient.allFlags();
    }
}