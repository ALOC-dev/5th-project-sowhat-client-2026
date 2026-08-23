import logoIcon from "../assets/logo-icon.png";

type LogoIconProps = {
	size?: number;
};

export default function LogoIcon({ size = 30 }: LogoIconProps) {
	return (
		<img
			src={logoIcon}
			alt="So What"
			height={size}
			style={{ width: "auto" }}
		/>
	);
}
