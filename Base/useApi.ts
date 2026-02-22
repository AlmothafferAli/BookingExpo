import { useState } from 'react';
import { router } from 'expo-router';
import { Alert } from 'react-native';

interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    successMessage?: string;
    errorMessage?: string;
    redirectTo?: string; // e.g. "/(tabs)/Home"
}

export function useApi<T, A>(
    apiFn: (args: A) => Promise<T>,
    options: UseApiOptions<T> = {}
) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const execute = async (args: A, overrideOptions?: UseApiOptions<T>) => {
        const finalOptions = { ...options, ...overrideOptions };
        setLoading(true);
        setError(null);
        try {
            // RTK Query hooks return an object like { data, error, ... } if used directly, 
            // but here we expect apiFn to be the "trigger" function from useLazyQuery or useMutation.
            // If it's a mutation trigger, it returns { unwrap: () => Promise<T> }.

            // However, the previous implementation assumed apiFn returns a Promise directly. 
            // RTK Query mutation triggers return a "Promise-like" object with .unwrap().
            // We should check if .unwrap exists.

            const resultPromise = apiFn(args);
            const result = (resultPromise as any).unwrap ? await (resultPromise as any).unwrap() : await resultPromise;

            setData(result);

            if (finalOptions.successMessage) {
                Alert.alert("نجاح", finalOptions.successMessage);
            }

            if (finalOptions.onSuccess) {
                finalOptions.onSuccess(result);
            }

            if (finalOptions.redirectTo) { // @ts-ignore
                router.replace(finalOptions.redirectTo);
            }

            return result;
        } catch (err: any) {
            setError(err);

            const error = err?.error || err;
            let errorMessage = null;

            if (error) {
                if (error.status === 'PARSING_ERROR' && error.originalStatus === 400) {
                    errorMessage = typeof error.data === 'string' ? error.data : "invalid request";
                } else if (typeof error.status === 'number') {
                    switch (error.status) {
                        case 400:
                            errorMessage = error.message || (typeof error.data === 'string' ? error.data : "Bad Request");
                            break;
                        case 401:
                            errorMessage = error.data?.message || "Unauthorized";
                            break;
                        case 403:
                            errorMessage = error.data?.message || "Forbidden";
                            break;
                        case 404:
                            errorMessage = error.data?.message || "Not Found";
                            break;
                        case 500:
                            errorMessage = "Internal Server Error";
                            break;
                        default:
                            errorMessage = `Error ${error.status}`;
                    }
                } else {
                    errorMessage = error.message || "Unknown Error";
                }
            }

            const message = errorMessage ||
                finalOptions.errorMessage ||
                "حدث خطأ غير متوقع";

            Alert.alert("تنبيه", message);

            if (finalOptions.onError) {
                finalOptions.onError(err);
            }
            // We don't throw here to avoid unhandled promise rejections in UI unless needed
        } finally {
            setLoading(false);
        }
    };

    return {
        execute,
        data,
        error,
        loading
    };
}
