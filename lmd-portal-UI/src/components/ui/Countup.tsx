import CountUp from "react-countup";
import ReactVisibilitySensor from "react-visibility-sensor";

const Counter = ({
  end,
  decimals,
  duration = 0.6,
}: {
  end: number;
  decimals: number | undefined;
  duration?: number;
}) => {
  return (
    <CountUp end={end} duration={duration} decimals={decimals ? decimals : 0}>
      {({ countUpRef, start }) => (
        <ReactVisibilitySensor onChange={start} delayedCall>
          <span
            className="tonni_tm_counter"
            data-from="0"
            data-to={end.toLocaleString()}
            ref={countUpRef}
          >
            count
          </span>
        </ReactVisibilitySensor>
      )}
    </CountUp>
  );
};

export default Counter;
