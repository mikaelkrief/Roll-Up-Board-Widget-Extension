import * as LDClient from "ldclient-js";
import Q = require("q");
export class LaunchDarklyService {

    // Private Settings to Tokenize
    private envId: string = "590348c958ed570a3af8a496";
    private static UriHashKey: string = "https://vsts-ext-feature-flags3-earlyadopters.azurewebsites.net/api/GetHashKey?code=9AORpUmdI4U7u1XUBiME6lHrDfp3Cl7qEg5ykR5Ko9C3IAXvx42QOQ==";
    private static UriUpdateFlagUser: string = "https://vstsextcrypto.azurewebsites.net/api/UpdateUserFeature?code=erZlsJHBh9u/bwO1ZCO4czrvzqMA9XpUJjV6a9wHuMM1ajwprmcOKw==";
    // ----------------------------
    public ldClient: any;
    private static instance: LaunchDarklyService;
    public static user: any;
    public static flags: any;

    constructor() { }

    public static init(user: any, appToken: string, userid: string): Promise<LaunchDarklyService> {
        console.log(userid);
        let deferred = Q.defer<LaunchDarklyService>();
        if (!this.instance) {
            this.instance = new LaunchDarklyService();
            this.hashUserKey(user, true, appToken, userid).then((h) => {
                this.instance.ldClient = LDClient.initialize(this.instance.envId, user, {
                    hash: h
                });

                this.instance.ldClient.on("change", (flags) => {
                    this.setFlags();
                });
                this.user = user;

                deferred.resolve(this.instance);
            });
        }
        return deferred.promise;
    }

    public static setFlags() {
        this.flags = this.instance.ldClient.allFlags();
    }

    public static updateFlag(feature, value) {
        this.flags[feature] = value;
    }

    public static trackEvent(event: string) {
        this.instance.ldClient.track(event);
    }
    private static hashUserKey(user, hash: boolean, appToken: string, userid: string): Promise<string> {
        let deferred = Q.defer<string>();
        if (hash) {
            $.ajax({
                url: this.UriHashKey,
                type: "POST",
                headers: { "Access-Control-Allow-Origin": "*" },
                data: { account: "" + user.custom.account + "", token: "" + appToken + "" },
                success: c => {
                    deferred.resolve(c);
                }
            });
        } else {
            deferred.resolve(user.key);
        }
        return deferred.promise;
    }

    public static updateUserFeature(user, enable, feature/*, project, env*/): Promise<string> {
        let deferred = Q.defer<string>();
        if (user) {
            $.ajax({
                url: this.UriUpdateFlagUser,
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