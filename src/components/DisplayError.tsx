interface DisplayErrorProps {
    message: string;
}

const DisplayError = ({ message }: DisplayErrorProps) => {
    return (
        <span className="flex justify-center items-center size-full text-3xl md:text-5xl">
            Error: {message}
        </span>
    );
};
export default DisplayError;
