import {Button, ButtonProps} from "@/components/ui/button.tsx";

export const IconButton: React.FC<{ icon: string, text: string, buttonProps: ButtonProps }> = ({icon, text, buttonProps}) => {
    return (<Button className="flex items-center w-48 gap-2" {...buttonProps}>
        <div className="bg-black rounded-full flex justify-center items-center w-6 h-6">
            <img src={icon} alt={text} className="w-4 h-4"/>
        </div>
        <span className="flex-grow text-left">{text}</span>
    </Button>)
}