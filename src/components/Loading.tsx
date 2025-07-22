const Loading = () => {
    return (
        <span className="flex justify-center items-center size-full text-5xl md:text-7xl">
            Loading
            <span className="animate-blink">.</span>
            <span className="animate-blink [animation-delay:0.2s]">.</span>
            <span className="animate-blink [animation-delay:0.4s]">.</span>
        </span>
    );
};
export default Loading;
