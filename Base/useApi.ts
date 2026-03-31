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
    apiFn: (args: A) => any,
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

            const response = await apiFn(args);

            // RTK Query triggers resolve with an object containing { data } or { error }.
            // We handle this manually instead of using .unwrap() to avoid "Uncaught (in promise)" errors
            // that sometimes occur when the environment tracks the unwrapped rejection.
            if (response && typeof response === 'object' && 'error' in response) {
                throw response;
            }

            // Extract data if it's an RTK Query result, otherwise use the response as is
            const result = (response && typeof response === 'object' && 'data' in response)
                ? response.data
                : response;

            const typedResult = result as T;
            setData(typedResult);

            if (finalOptions.successMessage) {
                Alert.alert("نجاح", finalOptions.successMessage);
            }

            if (finalOptions.onSuccess) {
                finalOptions.onSuccess(typedResult);
            }

            if (finalOptions.redirectTo) { // @ts-ignore
                router.replace(finalOptions.redirectTo);
            }

            return result;
        } catch (err: any) {
            setError(err);

            const rtkError = err?.error || err;
            let errorMessage = null;

            if (rtkError) {
                if (rtkError.status === 'PARSING_ERROR' && rtkError.originalStatus === 400) {
                    errorMessage = typeof rtkError.data === 'string' ? rtkError.data : "Invalid request format";
                } else if (typeof rtkError.status === 'number') {
                    // Extract message from response body if it exists
                    const data = rtkError.data;
                    if (data) {
                        if (typeof data === 'string') {
                            errorMessage = data;
                        } else if (typeof data === 'object') {
                            errorMessage = data.message || data.error || data.msg;
                        }
                    }

                    if (!errorMessage) {
                        switch (rtkError.status) {
                            case 400:
                                errorMessage = "طلب غير صالح"; // Bad Request
                                break;
                            case 401:
                                errorMessage = "غير مصرح لك"; // Unauthorized
                                break;
                            case 403:
                                errorMessage = "غير مسموح لك بالوصول"; // Forbidden
                                break;
                            case 404:
                                errorMessage = "المورد غير موجود"; // Not Found
                                break;
                            case 500:
                                errorMessage = "خطأ في خادم النظام"; // Internal Server Error
                                break;
                            default:
                                errorMessage = `خطأ ${rtkError.status}`;
                        }
                    }
                } else {
                    errorMessage = rtkError.message || (typeof rtkError === 'string' ? rtkError : null);
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
