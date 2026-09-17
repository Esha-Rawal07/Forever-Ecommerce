import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import parcelIcon from "../assets/parcel_icon.svg";

const Orders = ({ token }) => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // =========================
    // Fetch All Orders
    // =========================
    const fetchAllOrders = async () => {

        if (!token) {
            setLoading(false);
            return;
        }

        try {

            setLoading(true);
            setErrorMessage("");

            const response = await axios.post(
                backendUrl + "/api/order/list",
                {},
                {
                    headers: {
                        token
                    }
                }
            );

            if (response.data.success) {

                setOrders(response.data.orders || []);

            } else {

                setErrorMessage(
                    response.data.message || "Unable to load orders"
                );

                toast.error(
                    response.data.message || "Unable to load orders"
                );
            }

        } catch (error) {

            const message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong";

            console.log("Order Error:", error);

            setErrorMessage(message);
            toast.error(message);

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // Refresh Orders
    // =========================
    const refreshOrders = () => {

        setLoading(true);
        setErrorMessage("");

        fetchAllOrders();
    };


    // =========================
    // Update Order Status
    // =========================
    const statusHandler = async (event, orderId) => {

        try {

            const response = await axios.post(
                backendUrl + "/api/order/status",
                {
                    orderId: orderId,
                    status: event.target.value
                },
                {
                    headers: {
                        token
                    }
                }
            );

            if (response.data.success) {

                toast.success("Order status updated");

                fetchAllOrders();

            } else {

                toast.error(
                    response.data.message ||
                    "Unable to update order"
                );
            }

        } catch (error) {

            const message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong";

            console.log("Status Error:", error);

            toast.error(message);
        }
    };



    // =========================
    // Fetch Orders On Load
    // =========================
    useEffect(() => {

        fetchAllOrders();

    }, [token]);


    // =========================
    // Loading
    // =========================
    if (loading) {

        return (
            <div className="w-full">

                <div className="flex items-center justify-between mb-5">

                    <h3 className="text-lg font-medium text-gray-800">
                        Order Page
                    </h3>

                </div>

                <div className="border border-gray-200 py-12 text-center">

                    <p className="text-sm text-gray-500">
                        Loading orders...
                    </p>

                </div>

            </div>
        );
    }


    // =========================
    // Error
    // =========================
    if (errorMessage) {

        return (
            <div className="w-full">

                <div className="flex items-center justify-between mb-5">

                    <h3 className="text-lg font-medium text-gray-800">
                        Order Page
                    </h3>

                    <button
                        type="button"
                        onClick={refreshOrders}
                        className="
                            border
                            border-gray-300
                            px-4
                            py-2
                            text-sm
                            hover:bg-gray-50
                            transition
                        "
                    >
                        Refresh
                    </button>

                </div>

                <div className="border border-gray-200 py-12 flex flex-col items-center gap-3">

                    <img
                        className="w-16 h-16 object-contain"
                        src={parcelIcon}
                        alt="Orders unavailable"
                    />

                    <p className="text-sm text-red-500">
                        {errorMessage}
                    </p>

                </div>

            </div>
        );
    }


    // =========================
    // Main UI
    // =========================
    return (

        <div className="w-full">

            {/* =========================
                Header
            ========================== */}
            <div className="flex items-center justify-between mb-5">

                <h3 className="text-lg font-medium text-gray-800">
                    Order Page ({orders.length})
                </h3>

                <button
                    type="button"
                    onClick={refreshOrders}
                    className="
                        border
                        border-gray-300
                        px-4
                        py-2
                        text-sm
                        text-black
                        hover:bg-gray-50
                        transition
                    "
                >
                    Refresh
                </button>

            </div>


            {/* =========================
                No Orders
            ========================== */}
            {orders.length === 0 ? (

                <div className="
                    border
                    border-gray-800
                    py-14
                    flex
                    flex-col
                    items-center
                    gap-3
                ">

                    <img
                        className="w-20 h-20 object-contain"
                        src={parcelIcon}
                        alt="No orders"
                    />

                    <p className="text-sm text-gray-500">
                        No orders found.
                    </p>

                </div>

            ) : (

                /* =========================
                   Orders List
                ========================== */

                <div className="w-full">

                    {orders.map((order, index) => {

                        const items = Array.isArray(order.items)
                            ? order.items
                            : [];

                        const address = order.address || {};


                        return (

                            <div
                                key={order._id || index}
                                className="
                                    border
                                    border-gray-200
                                    p-5
                                    md:p-6
                                    my-3
                                    bg-white
                                "
                            >

                                {/* =========================
                                    Desktop Order Row
                                ========================== */}

                                <div className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-[75px_minmax(250px,2.5fr)_1.3fr_80px_160px]
                                    gap-5
                                    items-start
                                ">


                                    {/* =========================
                                        Package
                                    ========================== */}

                                    <div className="
                                        flex
                                        flex-col
                                        items-center
                                        gap-2
                                    ">

                                        <div className="
                                            w-16
                                            h-16
                                            border
                                            border-gray-200
                                            flex
                                            items-center
                                            justify-center
                                            bg-white
                                        ">

                                            <img
                                                src={parcelIcon}
                                                alt="Order package"
                                                className="
                                                    w-12
                                                    h-12
                                                    object-contain
                                                "
                                            />

                                        </div>

                                    </div>


                                    {/* =========================
                                        Product + Customer +
                                        Address
                                    ========================== */}

                                    <div className="
                                        text-xs
                                        sm:text-sm
                                        text-black
                                        leading-5
                                    ">

                                        {/* Products */}

                                        <div className="mb-2">

                                            {items.length > 0 ? (

                                                items.map(
                                                    (item, itemIndex) => (

                                                        <p
                                                            key={itemIndex}
                                                            className="font-normal"
                                                        >

                                                            {item.name ||
                                                                item.productName ||
                                                                "Product"}

                                                            {" X "}

                                                            {item.quantity || 1}

                                                            {item.size && (
                                                                <span>
                                                                    {" "}
                                                                    {item.size}
                                                                </span>
                                                            )}

                                                        </p>

                                                    )
                                                )

                                            ) : (

                                                <p className="text-gray-400">
                                                    No product information
                                                </p>

                                            )}

                                        </div>


                                        {/* Customer */}

                                        <p className="font-medium text-black">

                                            {address.firstName || ""}{" "}

                                            {address.lastName || ""}

                                        </p>


                                        {/* Street */}

                                        {address.street && (

                                            <p>
                                                {address.street},
                                            </p>

                                        )}


                                        {/* City / State / Country / Zip */}

                                        <p>

                                            {address.city || ""}

                                            {address.city &&
                                                address.state
                                                ? ", "
                                                : ""}

                                            {address.state || ""}

                                            {address.state &&
                                                address.country
                                                ? ", "
                                                : ""}

                                            {address.country || ""}

                                            {address.country &&
                                                address.zipcode
                                                ? ", "
                                                : ""}

                                            {address.zipcode || ""}

                                        </p>


                                        {/* Phone */}

                                        {address.phone && (

                                            <p>
                                                {address.phone}
                                            </p>

                                        )}

                                    </div>


                                    {/* =========================
                                        Order Details
                                    ========================== */}

                                    <div className="
                                        text-xs
                                        sm:text-sm
                                        text-black
                                        leading-5
                                    ">

                                        <p>
                                            Items : {items.length}
                                        </p>

                                        <p>
                                            Method :{" "}
                                            {order.paymentMethod || "COD"}
                                        </p>

                                        <p>
                                            Payment :{" "}

                                            <span
                                                className={
                                                    order.payment
                                                        ? "text-green-600"
                                                        : "text-black"
                                                }
                                            >

                                                {order.payment
                                                    ? "Done"
                                                    : "Pending"}

                                            </span>

                                        </p>

                                        <p>
                                            Date :{" "}

                                            {order.date
                                                ? new Date(
                                                      order.date
                                                  ).toLocaleDateString()
                                                : "N/A"}

                                        </p>

                                    </div>


                                    {/* =========================
                                        Price
                                    ========================== */}

                                    <div className="
                                        text-sm
                                        font-medium
                                        text-black
                                        whitespace-nowrap
                                    ">

                                        {currency}
                                        {order.amount || 0}

                                    </div>


                                    {/* =========================
                                        Status
                                    ========================== */}

                                    <div>

                                        <select
                                            value={
                                                order.status ||
                                                "Order Placed"
                                            }
                                            onChange={(e) =>
                                                statusHandler(
                                                    e,
                                                    order._id
                                                )
                                            }
                                            className="
                                                w-full
                                                border
                                                border-gray-300
                                                px-3
                                                py-2
                                                text-xs
                                                sm:text-sm
                                                bg-white
                                                text-black
                                                outline-none
                                                cursor-pointer
                                                focus:border-gray-500
                                            "
                                        >

                                            <option value="Order Placed">
                                                Order Placed
                                            </option>

                                            <option value="Packing">
                                                Packing
                                            </option>

                                            <option value="Shipped">
                                                Shipped
                                            </option>

                                            <option value="Out for delivery">
                                                Out for delivery
                                            </option>

                                            <option value="Delivered">
                                                Delivered
                                            </option>

                                        </select>

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>
    );
};

export default Orders;