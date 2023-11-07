import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "Apoyo Diagnóstico",
          "Impulsado por IA",
          "Rápido",
          "Preciso",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 30,
        delay: 30
      }}
    />
  );
}

export default Type;
