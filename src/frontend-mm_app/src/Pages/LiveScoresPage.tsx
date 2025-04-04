import { Button } from "@/components/ui/button";

export function LiveScoresPage() {
    return (
        <div id="buttonGroup" className="flex w-full py-4 px-5 items-center">
                <div className="button">
                    <Button type="submit" className="bg-[var(--primary-color)] font-bold hover:bg-blue-900 mt-4">
                        Round of 64
                    </Button>
                </div>

                <div className="button">
                    <Button type="submit" className="bg-[var(--primary-color)] font-bold hover:bg-blue-900 mt-4">
                        Round of 32
                    </Button>
                </div>

                <div className="button">
                    <Button type="submit" className="bg-[var(--primary-color)] font-bold hover:bg-blue-900 mt-4">
                        Sweet 16
                    </Button>
                </div>

                <div className="button">
                    <Button type="submit" className="bg-[var(--primary-color)] font-bold hover:bg-blue-900 mt-4">
                        Elite 8
                    </Button>
                </div>

                <div className="button">
                    <Button type="submit" className="bg-[var(--primary-color)] font-bold hover:bg-blue-900 mt-4">
                        Final 4
                    </Button>
                </div>

                <div className="button">
                    <Button type="submit" className="bg-[var(--primary-color)] font-bold hover:bg-blue-900 mt-4">
                        Final
                    </Button>
                </div>
        </div>
    );
}