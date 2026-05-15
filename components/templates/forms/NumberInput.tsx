"use client";

import { useState, type InputHTMLAttributes } from "react";

export type NumberInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"value" | "onChange" | "type"
> & {
	value: number;
	onChange: (n: number) => void;
	float?: boolean;
	emptyValue?: number;
};

/**
 * Number input that round-trips through a local string buffer so the user
 * can type "1." or "-" without the value snapping back. Re-syncs when the
 * parent resets value externally (form reset, edit-mode load).
 *
 * In integer mode, typing "1.5" silently commits 1 and snaps the displayed
 * text to "1". In float mode, step defaults to "any" so the browser doesn't
 * reject decimals.
 */
export function NumberInput({
	value,
	onChange,
	float,
	emptyValue = 0,
	...rest
}: NumberInputProps) {
	const [text, setText] = useState(() => String(value));
	const [lastCommitted, setLastCommitted] = useState(value);

	if (!Object.is(value, lastCommitted)) {
		setLastCommitted(value);
		setText(String(value));
	}

	const stepFromFloat: InputHTMLAttributes<HTMLInputElement>["step"] = float
		? "any"
		: undefined;

	return (
		<input
			type="number"
			step={stepFromFloat}
			value={text}
			onChange={(e) => {
				const v = e.target.value;
				if (v === "" || v === "-") {
					setText(v);
					setLastCommitted(emptyValue);
					onChange(emptyValue);
					return;
				}
				const n = float ? parseFloat(v) : parseInt(v, 10);
				if (Number.isNaN(n)) {
					setText(v);
					return;
				}
				const snapped = !float && String(n) !== v ? String(n) : v;
				setText(snapped);
				setLastCommitted(n);
				onChange(n);
			}}
			{...rest}
		/>
	);
}
