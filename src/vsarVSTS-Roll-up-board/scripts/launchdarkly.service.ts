import * as LDClient from "ldclient-js";
import Q = require("q");
export class LaunchDarklyService {

    public ldClient: any;
    public envId: string = "590348c958ed570a3af8a496";
    private static _instance: LaunchDarklyService;
    public static user: any;
    public static flags: any;

    constructor() { }

    public static Init(user: any): Promise<LaunchDarklyService> {
        let deferred = Q.defer<LaunchDarklyService>();
        if (!this._instance) {
            this._instance = new LaunchDarklyService();
            this.HashUserKey(user, true).then((h) => {
                this._instance.ldClient = LDClient.initialize(this._instance.envId, user, {
                    hash: h
                });

                this._instance.ldClient.on("change", (flags) => {
                    // console.log(flags);
                    // this.showNewDone = flags["show-newdone"].current;
                    this.SetFlags();
                    // console.log(this.showNewDone);
                });
                this.user = user;

                deferred.resolve(this._instance);
            });
        }
        return deferred.promise;
    }

    public static SetFlags() {
        this.flags = this._instance.ldClient.allFlags();
    }

    public static UpdateFlag(feature, value) {
        this.flags[feature] = value;
    }

    /*public static GetAllFlags() {
        this.enabletelemetry = this._instance.ldClient.variation("enable-telemetry", false);
        this.displayLogs = this._instance.ldClient.variation("display-logs", false);
        this.showNewDone = this._instance.ldClient.variation("show-newdone", false);
        console.log("this.displayLogs: " + this.displayLogs);
        console.log("this.enabletelemetry: " + this.enabletelemetry);
        console.log("this.showNewDone: " + this.showNewDone);
    }*/

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

    public static UpdateUserFeature(user, enable, feature/*, project, env*/): Promise<string> {
        let deferred = Q.defer<string>();
        console.log(user);
        if (user) {
            $.ajax({
                url: "https://vstsextcrypto.azurewebsites.net/api/HttpTriggerJS2?code=//ufvbsCUayEkeDsn06T3rUj6ijbUCO0epCDi1XNC0AHk5a4vVxmaQ==",
                contentType: "application/json; charset=UTF-8",
                type: "POST",
                dataType: "json",
                headers: { "Access-Control-Allow-Origin": "*" },
                data: "{'userkey':'" + user.key + "', 'active':" + enable + ", 'feature' : '" + feature + "' }",
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