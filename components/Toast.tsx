import toast, { Toast } from "react-hot-toast";
import Icon from "./Icon";

interface ToastProps {
  t: Toast;
  title: string;
  description: string;
}

export function SuccessToast(props: ToastProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex justify-center items-center [background:rgba(40,167,69,0.05)] shadow-[0_5px_4px_0_rgba(40,167,69,0.20)] p-2.5 rounded-full overflow-visible">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
        >
          <g clipPath="url(#clip0_128_2359)">
            <rect x="10" y="10" width="40" height="40" rx="20" fill="white" />
            <path
              d="M30 10C19.0148 10 10 19.0148 10 30C10 40.9852 19.0148 50 30 50C40.9852 50 50 40.9852 50 30C50 19.0148 40.9852 10 30 10ZM32.5903 35.2322C29.9324 37.8411 25.6434 37.7346 23.1182 34.997L20.2916 31.9326C19.4702 31.0421 19.4981 29.6621 20.3547 28.8055C21.3052 27.855 22.8706 27.9405 23.7119 28.9889L24.9123 30.4849C26.4098 32.3511 29.2044 32.482 30.8697 30.7638L37.2564 24.1747C38.1848 23.2169 39.7289 23.2414 40.6265 24.2281C41.4625 25.1473 41.4224 26.563 40.5357 27.4334L32.5903 35.2322Z"
              fill="#28B446"
            />
            <path
              d="M30 5C43.7466 5 55 16.2534 55 30C55 43.7466 43.7466 55 30 55C16.2534 55 5 43.7466 5 30C5 16.2534 16.2534 5 30 5Z"
              stroke="#28A745"
              strokeOpacity="0.1"
              strokeWidth="10"
            />
          </g>
          <rect
            x="5"
            y="5"
            width="50"
            height="50"
            rx="25"
            stroke="#28A745"
            strokeOpacity="0.1"
            strokeWidth="10"
          />
          <defs>
            <clipPath id="clip0_128_2359">
              <rect x="10" y="10" width="40" height="40" rx="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="flex flex-col items-start">
        <h3 className="text-[var(--auditly-dark-blue)] [font-family:Poppins] text-xl font-semibold leading-[normal]">
          {props.title}
        </h3>
        <p className="text-black [font-family:Poppins] text-sm font-normal leading-[normal]">
          {props.description}
        </p>
      </div>
      <button
        className="btn btn-ghost rounded-md hover:bg-transparent absolute top-0 right-0 p-2"
        onClick={() => toast.dismiss(props.t.id)}
      >
        <Icon name="close" className="font-lg! font-light!" />
      </button>
    </div>
  );
}
