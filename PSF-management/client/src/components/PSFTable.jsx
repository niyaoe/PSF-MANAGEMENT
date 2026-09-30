const PSFTable = ({ records }) => {
    if (!records || records.length === 0) {
        return <p>No PSF records found.</p>;
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>RO Number</th>
                        <th>Customer Name</th>
                        <th>Registration No.</th>
                        <th>Branch</th>
                        <th>Model</th>
                        <th>Service Type</th>
                        <th>SA Name</th>
                        <th>Bill Date</th>
                        <th>Complaint Status</th>
                        <th>Call Date</th>
                        <th>Rating</th>
                        <th>CRM/CXM Remarks</th>
                    </tr>
                </thead>

                <tbody>
                    {records.map((record) => (
                        <tr key={record._id}>
                            <td>
                                {record.roNumber}
                            </td>

                            <td>
                                {record.customerName}
                            </td>

                            <td>
                                {record.registrationNumber}
                            </td>

                            <td>
                                {record.branchId?.name}
                            </td>

                            <td>
                                {record.model}
                            </td>

                            <td>
                                {record.serviceType}
                            </td>

                            <td>
                                {record.serviceAdvisorName}
                            </td>

                            <td>
                                {record.billDate
                                    ? new Date(
                                        record.billDate
                                    ).toLocaleDateString()
                                    : ""}
                            </td>

                            <td>
                                {record.complaintStatus}
                            </td>

                            <td>
                                {record.callDate
                                    ? new Date(
                                        record.callDate
                                    ).toLocaleDateString()
                                    : ""}
                            </td>

                            <td>
                                {record.rating}
                            </td>

                            <td>
                                {record.crmCxmRemarks}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PSFTable;