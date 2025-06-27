import React from "react";

interface IframeProps {
    src: string;
    width?: number | string;
    height?: number | string;
}

const IframeContainer: React.FC<IframeProps> = ({ src, width = "100%", height = 400 }) => {
    return (
        <div className="flex flex-col p-5">
            <iframe
                src={src}
                width={width}
                height={height}
                className="border rounded-lg shadow-sm"
                allowFullScreen
            />
        </div>
    );
};

const Page: React.FC = () => {
    return (
        <main className="flex min-h-screen flex-col p-7">
            <div className="flex flex-col space-y-4 max-h-screen">
                <IframeContainer 
                    src="https://player.twitch.tv/?channel=gress_g&parent=www.example.com" 
                />

                <IframeContainer 
                    src="https://www.youtube.com/embed/J1X23YeBeEg?si=Yy0Tl6mDIbu06PR9"
                />

                <IframeContainer 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14943.643187053458!2d-101.2202531!3d20.5508304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842c8576a4873ec5%3A0x7a6ca331bfcaf73b!2sBodega%20Aurrera%2C%20Salamanca%20Sur!5e0!3m2!1ses-419!2smx!4v1749882705730!5m2!1ses-419!2smx"
                />
            </div>
        </main>
    );
};

export default Page;
