import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function SummaryPreview() {
    return (
        <Card className="sticky top-6">
            <CardHeader>
                <CardTitle>Summary Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Tax</span>
                        <span className="font-medium">$0.00</span>
                    </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                    <span className="text-base font-semibold text-primary">Total Amount</span>
                    <span className="text-xl font-bold text-primary">$0.00</span>
                </div>

                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 text-sm">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>
                        Invoices saved here will be available for automatic reconciliation in the
                        <span className="font-bold"> Bank Recon</span> tab once your statements are imported.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
