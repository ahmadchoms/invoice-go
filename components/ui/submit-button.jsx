import { Loader2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

const SubmitButton = ({ isLoading, loadingText, text, className }) => (
    <Button className={cn(className)} type="submit" disabled={isLoading}>
        {isLoading ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingText}
            </>
        ) : (
            text
        )}
    </Button>
);

export default SubmitButton