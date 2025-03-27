import { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel'

function ServiceCarousels({ services }) {
    const items = []
    const [activeIndex, setActiveIndex] = useState(0)
    for (let i = 0; i < services.length; i += 4) {
        items.push(
        <Carousel.Item key={i}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {services.slice(i, i + 4).map((service, index) => (
                <div>aafs</div>
                // <ExampleCarouselImage key={index} service={service} role={"service"} />
            ))}
            </div>
        </Carousel.Item>
        )
    }

  return <Carousel>{items}</Carousel>
}

export default ServiceCarousels