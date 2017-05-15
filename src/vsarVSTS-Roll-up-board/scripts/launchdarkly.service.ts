import * as LDClient from 'ldclient-js';

export class LaunchDarklyService {

    public envId: string = "590348c958ed570a3af8a496";
    public enabletelemetry: boolean;
    public displayLogs: boolean;

    constructor() {
    }

    public init(user, LDClient): any {
        return LDClient.initialize(this.envId, user);
    }

    public GetAllFlags(ldclient) {
        this.enabletelemetry = ldclient.variation("enable-telemetry", false);
        this.displayLogs = ldclient.variation("display-logs", false);
        console.log("this.displayLogs: " + this.displayLogs);
        console.log("this.enabletelemetry: " + this.enabletelemetry);

        // for view all user flags
        // let flags = ldclient.allFlags();
    }
}