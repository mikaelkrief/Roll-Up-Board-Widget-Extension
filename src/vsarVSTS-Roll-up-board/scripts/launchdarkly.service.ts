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
            this.HashUserKey(user).then((h) => {
                this._instance.ldClient = LDClient.initialize(this._instance.envId, user, {
                    hash: h
                });
                console.log(this._instance);
            });
        }
        return this._instance;
    }

    public GetAllFlags() {
        this.enabletelemetry = this.ldClient.variation("enable-telemetry", false);
        this.displayLogs = this.ldClient.variation("display-logs", false);
        console.log("this.displayLogs: " + this.displayLogs);
        console.log("this.enabletelemetry: " + this.enabletelemetry);

        // for view all user flags
        // let flags = ldclient.allFlags();
    }

    public Trackevent(event: string) {
        this.ldClient.track(event);
    }
    private static HashUserKey(user): Promise<string> {
        let deferred = Q.defer<string>();
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
        return deferred.promise;
    }
    /*public static InitService(user: any): Q.Promise<any> {
    var deferred = Q.defer<any>();
    var ldclient = LDClient.initialize(this._instance.envId, user);
    ldclient.on('ready', function () {
        deferred.resolve(ldclient)
    })
    return deferred.promise;
}*/
}