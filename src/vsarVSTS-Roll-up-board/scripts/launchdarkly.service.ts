import * as LDClient from "ldclient-js";

export class LaunchDarklyService {

    ldClient: any;
    flags: any;
    public envId: string = "590348c958ed570a3af8a496";
    public enabletelemetry: boolean;
    public displayLogs: boolean;

    constructor(user: any) {
        this.ldClient = LDClient.initialize(this.envId, user);
    }

    public GetAllFlags() {
        this.enabletelemetry = this.ldClient.variation("enable-telemetry", false);
        this.displayLogs = this.ldClient.variation("display-logs", false);
        console.log("this.displayLogs: " + this.displayLogs);
        console.log("this.enabletelemetry: " + this.enabletelemetry);

        // for view all user flags
        // let flags = ldclient.allFlags();
    }
}