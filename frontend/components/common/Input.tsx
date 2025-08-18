import React, { useState, useRef } from 'react';
import {
	View,
	TextInput,
	Text,
	TextInputProps,
	ViewStyle,
	TextStyle,
	Animated,
	TouchableOpacity,
} from 'react-native';

interface InputProps extends TextInputProps {
	label?: string;
	error?: string;
	success?: boolean;
	containerStyle?: ViewStyle;
	labelStyle?: TextStyle;
	inputStyle?: TextStyle;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	className?: string;
	inputClassName?: string;
	labelClassName?: string;
	variant?: 'default' | 'filled' | 'outlined' | 'glass';
	size?: 'sm' | 'md' | 'lg';
	animated?: boolean;
}

export const Input: React.FC<InputProps> = ({
	label,
	error,
	success,
	containerStyle,
	labelStyle,
	inputStyle,
	leftIcon,
	rightIcon,
	className,
	inputClassName,
	labelClassName,
	variant = 'default',
	size = 'md',
	animated = false,
	...props
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const animatedLabelPosition = useRef(new Animated.Value(props.value ? 1 : 0)).current;
	const animatedBorderColor = useRef(new Animated.Value(0)).current;

	// Size configurations
	const sizeConfig = {
		sm: {
			container: 'min-h-10',
			text: 'text-sm',
			padding: 'px-3 py-2',
			iconPadding: 'px-3'
		},
		md: {
			container: 'min-h-12',
			text: 'text-base',
			padding: 'px-4 py-3',
			iconPadding: 'px-4'
		},
		lg: {
			container: 'min-h-14',
			text: 'text-lg',
			padding: 'px-5 py-4',
			iconPadding: 'px-5'
		}
	};

	const { container, text, padding, iconPadding } = sizeConfig[size];

	const handleFocus = () => {
		setIsFocused(true);
		if (animated) {
			Animated.parallel([
				Animated.timing(animatedLabelPosition, {
					toValue: 1,
					duration: 200,
					useNativeDriver: false,
				}),
				Animated.timing(animatedBorderColor, {
					toValue: 1,
					duration: 200,
					useNativeDriver: false,
				}),
			]).start();
		}
		props.onFocus?.({} as any);
	};

	const handleBlur = () => {
		setIsFocused(false);
		if (animated && !props.value) {
			Animated.timing(animatedLabelPosition, {
				toValue: 0,
				duration: 200,
				useNativeDriver: false,
			}).start();
		}
		if (animated) {
			Animated.timing(animatedBorderColor, {
				toValue: 0,
				duration: 200,
				useNativeDriver: false,
			}).start();
		}
		props.onBlur?.({} as any);
	};

	// Container classes
	const containerClasses = [
		"mb-4",
		className
	].filter(Boolean).join(" ");

	// Label classes  
	const labelClasses = [
		"text-base font-semibold text-neutral-700 mb-2",
		labelClassName
	].filter(Boolean).join(" ");

	// Input container classes based on variant
	const getInputContainerClasses = () => {
		const baseClasses = `flex-row items-center ${container}`;

		switch (variant) {
			case 'filled':
				return `${baseClasses} bg-neutral-100 rounded-2xl border-2 border-transparent ${error ? 'border-error-500 bg-error-50' :
					success ? 'border-success-500 bg-success-50' :
						isFocused ? 'border-primary-500 bg-white' : ''
					}`;
			case 'outlined':
				return `${baseClasses} bg-transparent rounded-2xl border-2 ${error ? 'border-error-500' :
					success ? 'border-success-500' :
						isFocused ? 'border-primary-500' : 'border-neutral-300'
					}`;
			case 'glass':
				return `${baseClasses} glass rounded-2xl border ${error ? 'border-error-500/50' :
					success ? 'border-success-500/50' :
						isFocused ? 'border-primary-500/50' : 'border-white/20'
					}`;
			default:
				return `${baseClasses} bg-white/90 backdrop-blur-sm rounded-2xl border-2 shadow-soft ${error ? 'border-error-500' :
					success ? 'border-success-500' :
						isFocused ? 'border-primary-500' : 'border-neutral-200'
					}`;
		}
	};

	// Input classes
	const inputClasses = [
		`flex-1 ${text} text-neutral-900 ${padding} outline-none`,
		leftIcon && "pl-0",
		rightIcon && "pr-0",
		inputClassName
	].filter(Boolean).join(" ");

	return (
		<View className={containerClasses} style={containerStyle}>
			{label && (
				<Text className={labelClasses} style={labelStyle}>
					{label}
				</Text>
			)}

			<View className="relative">
				<View className={getInputContainerClasses()}>
					{leftIcon && (
						<View className={iconPadding}>
							{leftIcon}
						</View>
					)}

					<TextInput
						className={inputClasses}
						onFocus={handleFocus}
						onBlur={handleBlur}
						placeholderTextColor="#94a3b8"
						{...props}
					/>

					{rightIcon && (
						<TouchableOpacity className={iconPadding}>
							{rightIcon}
						</TouchableOpacity>
					)}
				</View>

				{/* Animated floating label */}
				{label && animated && (
					<Animated.View
						className="absolute left-4 pointer-events-none"
						style={{
							top: animatedLabelPosition.interpolate({
								inputRange: [0, 1],
								outputRange: [16, -10],
							}),
						}}
					>
						<Animated.View
							className="px-2 bg-white rounded"
							style={{
								transform: [{
									scale: animatedLabelPosition.interpolate({
										inputRange: [0, 1],
										outputRange: [1, 0.8],
									})
								}]
							}}
						>
							<Text
								className={`font-medium ${error ? 'text-error-600' :
									success ? 'text-success-600' :
										isFocused ? 'text-primary-600' : 'text-neutral-600'
									}`}
								style={labelStyle}
							>
								{label}
							</Text>
						</Animated.View>
					</Animated.View>
				)}
			</View>

			{error && (
				<Text className="text-sm text-error-600 mt-2 font-medium">
					{error}
				</Text>
			)}

			{success && !error && (
				<Text className="text-sm text-success-600 mt-2 font-medium">
					入力が正常です
				</Text>
			)}
		</View>
	);
};