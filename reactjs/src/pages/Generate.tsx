
import { useState } from "react";
import { useParams } from "react-router-dom";
import type { IThumbnail } from "../assets/assets";

const Generate = () => {

  const { id } = useParams();
  const [ title, setTitle ] = useState("");
  const [ additionalDetails, setAdditionalDetails ] = useState("");

  const [ thumbnail, setThumbnail ] = useState<IThumbnail | null>(null);

  return (
    <div>

    </div>
  )
}

export default Generate;
