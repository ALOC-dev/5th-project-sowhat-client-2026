import logoIconDark from "../assets/logo-icon.png";
import logoIconLight from "../assets/logo-icon-light.png";

type LogoIconProps = {
	size?: number;
	variant?: "dark" | "light";
};

export default function LogoIcon({
	size = 30,
	variant = "dark",
}: LogoIconProps) {
	return (
		<img
			src={variant === "light" ? logoIconLight : logoIconDark}
			alt="So What"
			height={size}
			style={{ width: "auto" }}
		/>
	);
}
