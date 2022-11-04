import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { AvatarSmall } from './Avatar';

const ContactsCarousel = ({ contacts }) => {
	const carouselRef = React.createRef();
	const [offset, setOffset] = useState(0);
	const [fullWidth, setFullwidth] = useState(0);
	const [displayWidth, setDisplayWidth] = useState(0);
	const [stepsCount, setStepsCount] = useState(0);
	const [currentStep, setCurrentStep] = useState(1);

	useEffect(() => {
		setFullwidth(carouselRef.current.scrollWidth);
		setDisplayWidth(carouselRef.current.clientWidth);
		setStepsCount(Math.ceil(fullWidth / displayWidth));
	}, [fullWidth, displayWidth]);

	const handleClickArrow = (direction) => {
		switch (direction) {
			case 'right':
				setOffset((prev) => prev + displayWidth);
				setCurrentStep((prev) => prev + 1);
				break;
			case 'left':
				setOffset((prev) => prev - displayWidth);
				setCurrentStep((prev) => prev - 1);
				break;
		}
	};

	return (
		<div className="contacts_carousel">
			<LeftCircleOutlined
				className="left-arrow-icon"
				style={{ display: currentStep == 1 ? 'none' : '' }}
				onClick={() => handleClickArrow('left')}
			/>
			<div
				className="contacts_carousel-items"
				ref={carouselRef}
				style={{ transform: `translateX(-${offset}px)` }}>
				{contacts.map((c, idx) => {
					return (
						<>
							<div className="carousel-item">
								<AvatarSmall src={`/images/${c.avatar}`} />
								<div>{c.name}</div>
							</div>
							<div className="carousel-item">
								<AvatarSmall src={`/images/${c.avatar}`} />
								<div>{c.name}</div>
							</div>
						</>
					);
				})}
			</div>
			<RightCircleOutlined
				className="right-arrow-icon"
				style={{ display: currentStep == stepsCount ? 'none' : '' }}
				onClick={() => handleClickArrow('right')}
			/>
		</div>
	);
};

export default ContactsCarousel;
