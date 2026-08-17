import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import "./MotionPathGallery.scss";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const containers = [
  { cls: "initial", isStart: true },
  { cls: "second" },
  { cls: "third" },
  { cls: "fourth" },
  { cls: "fifth" },
  { cls: "sixth" },
];

const MotionPathGallery = () => {
  const ctxRef = useRef(null);

  useEffect(() => {
    const createTimeline = () => {
      ctxRef.current && ctxRef.current.revert();

      ctxRef.current = gsap.context(() => {
        const box = document.querySelector(".mp__box");
        const boxStartRect = box.getBoundingClientRect();

        const containerEls = gsap.utils.toArray(".mp__container:not(.initial)");

        const points = containerEls.map((container) => {
          const marker = container.querySelector(".mp__marker") || container;
          const r = marker.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - (boxStartRect.left + boxStartRect.width / 2),
            y: r.top + r.height / 2 - (boxStartRect.top + boxStartRect.height / 2),
          };
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".mp__container.initial",
            start: "clamp(top center)",
            endTrigger: ".mp__final",
            end: "clamp(top center)",
            scrub: 1,
          },
        });

        tl.to(".mp__box", {
          duration: 1,
          ease: "none",
          motionPath: {
            path: points,
            curviness: 1.5,
          },
        });
      });
    };

    createTimeline();
    window.addEventListener("resize", createTimeline);

    return () => {
      window.removeEventListener("resize", createTimeline);
      ctxRef.current && ctxRef.current.revert();
    };
  }, []);

  return (
    <>
      <div className="mp__spacer">scroll down</div>

      <div className="mp__main">
        <div className="mp__container initial">
          <div className="mp__box" />
        </div>
        <div className="mp__container second">
          <div className="mp__marker" />
        </div>
        <div className="mp__container third">
          <div className="mp__marker" />
        </div>
        <div className="mp__container fourth">
          <div className="mp__marker" />
        </div>
        <div className="mp__container fifth">
          <div className="mp__marker" />
        </div>
        <div className="mp__container sixth">
          <div className="mp__marker" />
        </div>
      </div>

      <div className="mp__spacer mp__final" />
    </>
  );
};

export default MotionPathGallery;