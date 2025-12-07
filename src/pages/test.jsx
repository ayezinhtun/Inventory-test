import { useEffect, useState } from "react";

import { useDeviceRequests } from "../context/DeviceRequestContext";

export default function InstallAdminQueue() {
    const {listInstallAdminQueue, adminApproveInstall, adminRejectInstall} = useDeviceRequests();

    const [rows, setRows] = useState([]);

    const load = async () => setRows(await listInstallAdminQueue());

    use
}