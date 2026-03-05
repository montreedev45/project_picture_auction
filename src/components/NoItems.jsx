import { Icon } from "@iconify/react";

function NoItems({ text = "no item" }) {
  return (
    <>
      <div
        className="no-data"
        style={{
          color: "rgb(176 174 174)",
          gridColumn: "1/4",
          placeItems: "center",
          display: "grid",
        }}
      >
        <Icon icon="mdi:gavel" width={"100px"} />
        <h1 style={{ textAlign: "center" }}>{text}</h1>
      </div>
    </>
  );
}

export default NoItems;
