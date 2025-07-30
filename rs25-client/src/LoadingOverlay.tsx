import React from "react";
import { useLoading } from "./LoadingContext";

export const GlobalLoading: React.FC = () => {
    const { loading } = useLoading();

    if (!loading) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-message">Processing...</div>
        </div>
    );
};