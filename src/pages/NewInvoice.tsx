import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ManualInvoiceEntry from "./ManualInvoiceEntry";
import InvoiceUpload from "../components/InvoiceUpload";
import SummaryPreview from "../components/invoices/SummaryPreview";

export default function NewInvoice() {
    return (
        <div className="flex flex-col space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Invoice Entry & Upload</h1>
                <p className="text-muted-foreground mt-1">
                    Add new invoices via OCR upload or manual entry for bank reconciliation.
                </p>
            </div>

            <Tabs defaultValue="manual" className="w-full">
                {/* Custom Tab Triggers */}
                <TabsList className="grid w-full grid-cols-2 max-w-md mb-8 bg-muted p-1 rounded-lg">
                    <TabsTrigger
                        value="upload"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                    >
                        Upload Image/PDF
                    </TabsTrigger>
                    <TabsTrigger
                        value="manual"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                    >
                        Manual Entry
                    </TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <TabsContent value="upload" className="mt-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Carga Inteligente (OCR)</CardTitle>
                                    <CardDescription>
                                        Sube tu documento para extraer información automáticamente.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <InvoiceUpload targetType="cliente" />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="manual" className="mt-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Manual Invoice Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ManualInvoiceEntry embedded={true} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>

                    {/* Sidebar Preview */}
                    <div className="lg:col-span-1">
                        <SummaryPreview />
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
