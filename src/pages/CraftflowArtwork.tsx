export function CraftflowMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`cf-mark ${className}`}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 20C3 21-4 8 4 4s17 1 16 16Zm0 0C19 3 32-4 36 4s-1 17-16 16Zm0 0c17-1 24 12 16 16s-17-1-16-16Zm0 0c1 17-12 24-16 16s1-17 16-16Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Original vector art direction, labelled as studio concepts throughout. */
export function CraftflowArtwork({
  index,
  instance,
  compact = false,
}: {
  index: number;
  instance: string;
  compact?: boolean;
}) {
  const id = `cf-art-${instance}-${index}`;
  return (
    <svg
      className={`cf-artwork cf-artwork--${index}`}
      viewBox={compact ? "0 0 800 800" : "0 0 1600 720"}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={
        index === 0
          ? "Offscript identity, electric blue editorial posters and sculptural silver typography"
          : index === 1
            ? "Onda personal care identity, lavender packaging and sculptural bottle"
            : "Forme design practice identity, forest green stationery and soft material textures"
      }
    >
      <defs>
        <linearGradient id={`${id}-silver`} x1="0" y1="0" x2="1" y2=".8">
          <stop stopColor="#737d95" />
          <stop offset=".18" stopColor="#f8fcff" />
          <stop offset=".34" stopColor="#b8c1ce" />
          <stop offset=".48" stopColor="#535e75" />
          <stop offset=".53" stopColor="#e9f0fa" />
          <stop offset=".72" stopColor="#fff" />
          <stop offset="1" stopColor="#8c96aa" />
        </linearGradient>
        <linearGradient id={`${id}-bottle`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#9d86ad" />
          <stop offset=".15" stopColor="#dac9e6" />
          <stop offset=".42" stopColor="#f1e6f5" />
          <stop offset=".74" stopColor="#d7c2e2" />
          <stop offset="1" stopColor="#a78bb9" />
        </linearGradient>
        <linearGradient id={`${id}-lid`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#9a9b7e" />
          <stop offset=".35" stopColor="#e9e8cc" />
          <stop offset="1" stopColor="#b6b79a" />
        </linearGradient>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f7f4eb" />
          <stop offset="1" stopColor="#dbd8ca" />
        </linearGradient>
        <filter
          id={`${id}-shadow`}
          x="-60%"
          y="-60%"
          width="220%"
          height="240%"
        >
          <feDropShadow
            dx="12"
            dy="26"
            stdDeviation="21"
            floodColor="#172020"
            floodOpacity=".2"
          />
        </filter>
        <filter
          id={`${id}-softshadow`}
          x="-80%"
          y="-80%"
          width="260%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      {index === 0 && (
        <g fontFamily="'Inter Variable', sans-serif">
          <rect width="1600" height="800" fill="#2445f3" />
          <rect x="875" width="725" height="800" fill="#d8dfeb" />
          <g>
            <text
              x="55"
              y="70"
              fill="#f1f4e9"
              fontSize="28"
              fontWeight="600"
              letterSpacing="-1.5"
            >
              offscript®
            </text>
            <text x="620" y="66" fill="#e4ebff" fontSize="14">
              Independent culture.
              <tspan x="620" dy="21">
                Unfiltered ideas.
              </tspan>
            </text>
            <g
              fill="#f0f5d8"
              fontSize="185"
              fontWeight="650"
              letterSpacing="-14"
            >
              <text x="40" y="282">
                Good
              </text>
              <text x="40" y="452">
                strange.
              </text>
            </g>
            <path d="M48 510h776" stroke="#aabaff" />
            <text x="52" y="554" fill="#d6e1ff" fontSize="15">
              For the ones who see things a little differently.
            </text>
            <g transform="translate(620 585) rotate(-13)">
              <rect width="190" height="72" rx="36" fill="#e6f18b" />
              <text
                x="95"
                y="44"
                fill="#1d2f87"
                textAnchor="middle"
                fontSize="17"
                fontWeight="550"
              >
                Stay curious. ↗
              </text>
            </g>
            <text x="52" y="656" fill="#d6e1ff" fontSize="14">
              Art. People. Possibility.
            </text>
          </g>
          <g transform="translate(1220 356) rotate(-12)">
            <ellipse
              cx="15"
              cy="185"
              rx="200"
              ry="44"
              fill="#344362"
              opacity=".16"
              filter={`url(#${id}-softshadow)`}
            />
            <g filter={`url(#${id}-shadow)`}>
              <ellipse
                cx="0"
                cy="0"
                rx="174"
                ry="214"
                fill="none"
                stroke={`url(#${id}-silver)`}
                strokeWidth="80"
              />
              <path
                d="m-191 13 378-30"
                stroke={`url(#${id}-silver)`}
                strokeWidth="69"
                strokeLinecap="round"
              />
            </g>
          </g>
          <text x="920" y="70" fill="#313f58" fontSize="15">
            A different frame of mind.
          </text>
          <text x="920" y="661" fill="#313f58" fontSize="15">
            An identity, off the beaten path.
          </text>
          <text x="1505" y="660" fill="#313f58" fontSize="28">
            ↗
          </text>
        </g>
      )}
      {index === 1 && (
        <g fontFamily="'Inter Variable', sans-serif">
          <rect width="1600" height="800" fill="#c4b5d1" />
          <path d="M0 600 1600 400v400H0Z" fill="#b7a6c8" />
          {compact ? (
            <g fill="#45334d">
              <text x="45" y="65" fontSize="17">
                Care, in your own rhythm.
              </text>
              <text
                x="40"
                y="245"
                fontFamily="'Instrument Serif', Georgia, serif"
                fontSize="210"
                letterSpacing="-9"
              >
                onda
              </text>
              <text x="45" y="735" fontSize="17">
                A little more you.
              </text>
            </g>
          ) : (
            <g transform="translate(40 -15)">
              <text x="75" y="88" fill="#45334d" fontSize="18">
                Care, in your own rhythm.
              </text>
              <text
                x="65"
                y="275"
                fontFamily="'Instrument Serif', Georgia, serif"
                fill="#45334d"
                fontSize="201"
                letterSpacing="-7"
              >
                A little
              </text>
              <text
                x="65"
                y="449"
                fontFamily="'Instrument Serif', Georgia, serif"
                fill="#45334d"
                fontSize="201"
                letterSpacing="-7"
              >
                more you.
              </text>
              <text x="80" y="635" fill="#45334d" fontSize="23">
                onda®
              </text>
              <text x="80" y="668" fill="#45334d" fontSize="12">
                Personal care. Personal space.
              </text>
            </g>
          )}
          <g
            transform={
              compact
                ? "translate(340 140) rotate(12 190 300)"
                : "translate(970 40) rotate(9 190 300)"
            }
          >
            <ellipse
              cx="186"
              cy="600"
              rx="150"
              ry="21"
              fill="#55435c"
              opacity=".2"
              filter={`url(#${id}-softshadow)`}
            />
            <g filter={`url(#${id}-shadow)`}>
              <path
                d="M89 142q-13 8-16 47L55 520q-1 53 53 57h155q52-3 50-57l-18-331q-2-39-16-47Z"
                fill={`url(#${id}-bottle)`}
              />
              <rect
                x="88"
                y="63"
                width="192"
                height="98"
                rx="17"
                fill={`url(#${id}-lid)`}
              />
              <ellipse cx="184" cy="66" rx="94" ry="13" fill="#e2e2c6" />
              <path
                d="M94 91h181M93 103h183M93 115h183M93 127h183M94 139h181"
                stroke="#7b7f61"
                strokeOpacity=".16"
              />
              <text
                x="180"
                y="326"
                textAnchor="middle"
                fontSize="88"
                fontFamily="'Instrument Serif', Georgia, serif"
                letterSpacing="-4"
                fill="#594160"
              >
                onda
              </text>
              <text
                x="180"
                y="367"
                textAnchor="middle"
                fontSize="10"
                letterSpacing="1.3"
                fill="#594160"
              >
                THE EVERYDAY WASH
              </text>
              <path d="M116 395h134" stroke="#a58bb2" />
              <text
                x="180"
                y="425"
                textAnchor="middle"
                fontSize="11"
                fill="#594160"
              >
                A softer way to start.
              </text>
              <text
                x="180"
                y="518"
                textAnchor="middle"
                fontSize="10"
                fill="#594160"
              >
                250 ml / Made for your rhythm
              </text>
            </g>
          </g>
          {!compact && (
            <g transform="translate(1310 365) rotate(-8)">
              <rect
                width="178"
                height="260"
                rx="2"
                fill="#e6dfc8"
                filter={`url(#${id}-shadow)`}
              />
              <text
                x="20"
                y="78"
                fontSize="59"
                fontFamily="'Instrument Serif', Georgia, serif"
                fill="#594160"
              >
                onda
              </text>
              <path d="M22 164h134" stroke="#9a8ca0" />
              <text x="22" y="190" fontSize="11" fill="#594160">
                A moment for you.
              </text>
              <text x="22" y="228" fontSize="10" fill="#594160">
                THE EVERYDAY COLLECTION
              </text>
            </g>
          )}
        </g>
      )}
      {index === 2 && (
        <g fontFamily="'Inter Variable', sans-serif">
          <rect width="1600" height="800" fill="#28483f" />
          <image
            href="/images/silk-drape.webp"
            x="800"
            width="800"
            height="800"
            preserveAspectRatio="xMidYMid slice"
            opacity=".6"
          />
          <rect x="800" width="800" height="800" fill="#263d31" opacity=".3" />
          <g transform={compact ? "translate(-25 30)" : "translate(75 0)"}>
            <text x="48" y="70" fill="#dae0cd" fontSize="16">
              An independent design practice.
            </text>
            <text
              x="38"
              y="391"
              fontFamily="'Instrument Serif', Georgia, serif"
              fontSize="230"
              letterSpacing="-9"
              fill="#edf0d9"
            >
              forme
            </text>
            <text x="51" y="453" fontSize="18" fill="#bfc9b8">
              Objects of intention.
            </text>
            <path d="M50 555h620" stroke="#9dac9b" strokeOpacity=".5" />
            <text x="50" y="603" fontSize="13" fill="#dae0cd">
              Considered, down to the last detail.
            </text>
          </g>
          <g
            transform={
              compact
                ? "translate(300 450) rotate(-14)"
                : "translate(1060 180) rotate(-14)"
            }
            filter={`url(#${id}-shadow)`}
          >
            <rect width="350" height="390" fill={`url(#${id}-paper)`} />
            <path d="M35 34h280" stroke="#67785d" strokeWidth=".6" />
            <text x="35" y="62" fontSize="11" fill="#3d5846">
              FORME / A MATERIAL PRACTICE
            </text>
            <g fill="none" stroke="#4e6652" strokeWidth="1.2">
              {Array.from({ length: 11 }, (_, i) => (
                <path
                  key={i}
                  d={`M${80 + i * 9} 275V${125 - i * 2}h${165 - i * 9}v150Z`}
                />
              ))}
            </g>
            <text
              x="34"
              y="352"
              fontSize="24"
              fontFamily="'Instrument Serif', Georgia, serif"
              fill="#3d5846"
            >
              Room for good things.
            </text>
          </g>
          {!compact && (
            <g
              transform="translate(1190 490) rotate(7)"
              filter={`url(#${id}-shadow)`}
            >
              <rect width="290" height="150" fill="#d5d9bf" />
              <text
                x="22"
                y="91"
                fontFamily="'Instrument Serif', Georgia, serif"
                fontSize="68"
                fill="#28483f"
              >
                forme
              </text>
              <text x="23" y="126" fontSize="10" fill="#28483f">
                Considered spaces. Lasting impressions.
              </text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
