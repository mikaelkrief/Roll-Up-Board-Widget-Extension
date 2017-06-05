import * as LDClient from "ldclient-js";
import Q = require("q");
export class LaunchDarklyService {

    public ldClient: any;
    public envId: string = "590348c958ed570a3af8a496";
    public static enabletelemetry: boolean;
    public static displayLogs: boolean;
    private static _instance: LaunchDarklyService;
    public static user: any;

    constructor() { }

    public static Init(user: any): Promise<LaunchDarklyService> {
        let deferred = Q.defer<LaunchDarklyService>();
        if (!this._instance) {
            this._instance = new LaunchDarklyService();
            this.HashUserKey(user, true).then((h) => {
                this._instance.ldClient = LDClient.initialize(this._instance.envId, user, {
                    hash: h
                });
                this.user = user;

                deferred.resolve(this._instance);
            });
        }
        return deferred.promise;
    }

    public static GetAllFlags() {
        this.enabletelemetry = this._instance.ldClient.variation("enable-telemetry", false);
        this.displayLogs = this._instance.ldClient.variation("display-logs", false);
        console.log("this.displayLogs: " + this.displayLogs);
        console.log("this.enabletelemetry: " + this.enabletelemetry);

        // for view all user flags
        // let flags = ldclient.allFlags();
    }

    public static Trackevent(event: string) {
        this._instance.ldClient.track(event);
    }
    private static HashUserKey(user, hash: boolean): Promise<string> {
        let deferred = Q.defer<string>();
        if (hash) {
            $.ajax({
                url: "https://vstsextcrypto.azurewebsites.net/api/HttpTriggerJS1?code=KAcuJd2suS14yMGIYHMhu3NL6BtrR8ZEASz1I/e5wNqP/s5M9YFVSQ==",
                contentType: "application/json; charset=UTF-8",
                type: "POST",
                dataType: "json",
                headers: { "Access-Control-Allow-Origin": "*" },
                data: "{'userkey':'" + user.key + "'}",
                success: c => {
                    deferred.resolve(c);
                }
            });
        } else {
            deferred.resolve(user.key);
        }
        return deferred.promise;
    }

    public static UpdateUserFeature(user, enable/*, project, env, feature*/): Promise<string> {
        let deferred = Q.defer<string>();
        console.log(user);
        if (user) {
            $.ajax({
                url: "https://vstsextcrypto.azurewebsites.net/api/HttpTriggerJS2?code=//ufvbsCUayEkeDsn06T3rUj6ijbUCO0epCDi1XNC0AHk5a4vVxmaQ==",
                contentType: "application/json; charset=UTF-8",
                type: "POST",
                dataType: "json",
                headers: { "Access-Control-Allow-Origin": "*" },
                data: "{'userkey':'" + user.key + "', 'active':" + enable + " }",
                success: c => {
                    deferred.resolve(c);
                }
            });
        } else {
            deferred.resolve(user.key);
        }
        return deferred.promise;
    }
}