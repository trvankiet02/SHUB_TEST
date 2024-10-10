const axios = require("axios");

const handleQueryType1 = (data, l, r) => {
  //   let sum = 0;
  //   for (let i = l; i <= r; i++) {
  //     sum += data[i];
  //   }
  //   return sum;
  return data.slice(l, r + 1).reduce((sum, value) => sum + value, 0);
};

const handleQueryType2 = (data, l, r) => {
  //   let result = 0;
  //   for (let i = l; i <= r; i++) {
  //     result += i % 2 === 0 ? data[i] : -data[i];
  //   }
  //   return result;
  return data.slice(l, r + 1).reduce((sum, value, index) => {
    return sum + (index + (l % 2) === 0 ? value : -value);
  });
};

const processData = async () => {
  try {
    const inputResponse = await axios.get(
      "https://test-share.shub.edu.vn/api/intern-test/input",
    );
    const { token, data, query } = inputResponse.data;

    const results = query.map((q) => {
      const [l, r] = q.range;
      if (q.type === "1") {
        return handleQueryType1(data, l, r);
      } else if (q.type === "2") {
        return handleQueryType2(data, l, r);
      }
    });

    console.log(results);

    const response = await axios.post(
      "https://test-share.shub.edu.vn/api/intern-test/output",
      results,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Kết quả đã được gửi thành công!");
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  }
};

processData();
