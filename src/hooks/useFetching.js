import { useState } from "react";


export default function useFetching(callback) {
    const [isLoading, SetIsLoading] = useState(false);
    const [fetchError, SetFetchError] = useState("");


    async function Fetching() {
        try {
            SetIsLoading(true);
            await callback();
        }
        catch (e) {
            SetFetchError(e);
        }
        finally {
            SetIsLoading(false);
        }
    }

    return [Fetching, isLoading, fetchError];
}